import json
from collections import deque
import logging
from services.Client import get_client
from WebSearchAgent import WebSearchAgent
from VectorStore import VectorStore
from system_prompts import LEGAL_AI_SYSTEM_PROMPT

class LegalAIAgent:
    """🤖 AGENT-BASED TOOL ORCHESTRATION - LLM decides which tools to call"""

    def __init__(self, search_api_key: str, mongo_connection_string: str):
        # Initialize LLM client using centralized client
        self.aiml_client = get_client()

        # Initialize tools
        self.web_search = WebSearchAgent(search_api_key)
        self.vector_store = VectorStore(mongo_connection_string)

        # Initialize conversation history (keep last 4 exchanges)
        self.conversation_history = deque(maxlen=8)  # 8 messages = 4 user/assistant pairs

        # Configuration
        self.MAX_ITERATIONS = 3
        self.MAX_HISTORY_PAIRS = 4

        # Tool registry for the agent
        self.available_tools = {
            "search_recent_laws": {
                "function": self._search_recent_laws_wrapper,
                "description": "Search for recent legal updates, new laws, and policy changes",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "Legal search query"},
                        "jurisdiction": {"type": "string", "description": "Country or jurisdiction (optional)"}
                    },
                    "required": ["query"]
                }
            },
            "search_country_context": {
                "function": self._search_country_context_wrapper,
                "description": "Search country-specific legal context and established laws from knowledge base",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "Context search query"},
                        "country": {"type": "string", "description": "Target country"}
                    },
                    "required": ["query", "country"]
                }
            }
        }

        # Track agent actions
        self.agent_actions = []

    def _add_agent_action(self, action: str, description: str):
        """Track agent actions with timestamp"""
        import datetime
        timestamp = datetime.datetime.now().isoformat()
        self.agent_actions.append({
            "action": action,
            "description": description,
            "timestamp": timestamp
        })

    def _search_recent_laws_wrapper(self, query: str, jurisdiction: str = None) -> str:
        """Wrapper for web search tool"""
        self._add_agent_action("web_search", f"Searching web for '{query}' in {jurisdiction or 'global'}")
        print(f"🔍 Agent executing: Web search for '{query}' in {jurisdiction or 'global'}")
        results = self.web_search.search_recent_laws(query, jurisdiction)
        return json.dumps(results, indent=2)

    def _search_country_context_wrapper(self, query: str, country: str) -> str:
        """Wrapper for vector store tool"""
        self._add_agent_action("vector_search", f"Searching vector store for '{query}' in {country}")
        print(f"🔍 Agent executing: Vector search for '{query}' in {country}")
        results = self.vector_store.search_similar(query, country)
        # Convert ObjectId to string for JSON serialization
        for result in results:
            if '_id' in result:
                result['_id'] = str(result['_id'])
        return json.dumps(results, indent=2)

    def _build_messages_with_history(self, user_query: str) -> list:
        """Build messages list with conversation history and current query"""
        # Use the system prompt from external file
        messages = [{"role": "system", "content": LEGAL_AI_SYSTEM_PROMPT}]

        # Add conversation history
        messages.extend(list(self.conversation_history))

        # Add current user query
        messages.append({"role": "user", "content": user_query})

        return messages

    def _add_to_history(self, user_query: str, assistant_response: str):
        """Add user query and assistant response to conversation history"""
        self.conversation_history.append({"role": "user", "content": user_query})
        self.conversation_history.append({"role": "assistant", "content": assistant_response})

        print(f"📚 History updated: {len(self.conversation_history)//2} conversation pairs stored")

    def chat_with_agent(self, user_query: str) -> str:
        """
        🎯 MAIN AGENT INTEGRATION POINT
        Agent decides whether and which tools to use with iterative capability
        """

        # Tool definitions
        tools_definition = [
            {
                "type": "function",
                "function": {
                    "name": "search_recent_laws",
                    "description": self.available_tools["search_recent_laws"]["description"],
                    "parameters": self.available_tools["search_recent_laws"]["parameters"]
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "search_country_context",
                    "description": self.available_tools["search_country_context"]["description"],
                    "parameters": self.available_tools["search_country_context"]["parameters"]
                }
            }
        ]

        try:
            # Build initial messages with history
            messages = self._build_messages_with_history(user_query)

            print(f"🤖 Agent analyzing query: '{user_query}' (with {len(self.conversation_history)//2} previous conversations)")

            # Iterative tool calling loop
            iteration = 0
            total_tool_calls = 0

            while iteration < self.MAX_ITERATIONS:
                iteration += 1
                print(f"🔄 Iteration {iteration}/{self.MAX_ITERATIONS}")

                # Agent makes decision
                response = self.aiml_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    tools=tools_definition,
                    tool_choice="auto",
                    temperature=0.3
                )

                response_message = response.choices[0].message

                # If no tools called, we have final response
                if not response_message.tool_calls:
                    print("✅ Agent decision: No more tools needed - providing final response")
                    final_response = response_message.content

                    # Add to conversation history
                    self._add_to_history(user_query, final_response)

                    return final_response

                # Tools were called
                num_tools = len(response_message.tool_calls)
                total_tool_calls += num_tools
                print(f"🔧 Agent decision: Using {num_tools} tool(s) - Total tools used: {total_tool_calls}")

                # Add agent's tool call message to conversation
                assistant_message = {
                    "role": "assistant",
                    "tool_calls": [
                        {
                            "id": tool_call.id,
                            "type": "function",
                            "function": {
                                "name": tool_call.function.name,
                                "arguments": tool_call.function.arguments
                            }
                        } for tool_call in response_message.tool_calls
                    ]
                }

                # Only add content if it's not None/null
                if response_message.content is not None:
                    assistant_message["content"] = response_message.content

                messages.append(assistant_message)

                # Execute each tool
                for tool_call in response_message.tool_calls:
                    function_name = tool_call.function.name
                    arguments = json.loads(tool_call.function.arguments)

                    print(f"   └── Calling {function_name} with args: {arguments}")

                    # Execute the tool
                    if function_name in self.available_tools:
                        tool_result = self.available_tools[function_name]["function"](**arguments)
                    else:
                        tool_result = f"Error: Tool {function_name} not found"

                    # Add tool result to conversation
                    messages.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": tool_result
                    })

                # Continue to next iteration to let agent decide if it needs more tools
                print(f"🔄 Completed iteration {iteration}, continuing to see if agent needs more information...")

            # If we've reached max iterations, force final response
            print(f"⚠️ Reached maximum iterations ({self.MAX_ITERATIONS}), generating final response...")

            # Add instruction to provide final answer
            messages.append({
                "role": "system",
                "content": "Please provide your final response based on all the information gathered so far. Do not call any more tools."
            })

            final_response_obj = self.aiml_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.3
            )

            final_response = final_response_obj.choices[0].message.content

            # Add to conversation history
            self._add_to_history(user_query, final_response)

            return final_response

        except Exception as e:
            logging.error(f"Agent error: {e}")
            error_response = f"I encountered an error while processing your request: {str(e)}"

            # Still add to history even if there was an error
            self._add_to_history(user_query, error_response)

            return error_response

    def clear_history(self):
        """Clear conversation history"""
        self.conversation_history.clear()
        print("🗑️ Conversation history cleared")

    def get_agent_actions(self):
        """Get current agent actions"""
        return self.agent_actions.copy()

    def clear_agent_actions(self):
        """Clear agent actions"""
        self.agent_actions.clear()

    def show_history(self):
        """Display current conversation history"""
        if not self.conversation_history:
            print("📚 No conversation history")
            return

        print(f"📚 Conversation History ({len(self.conversation_history)//2} exchanges):")
        print("-" * 60)

        for i, msg in enumerate(self.conversation_history):
            role_emoji = "👤" if msg["role"] == "user" else "🤖"
            content = msg["content"][:100] + "..." if len(msg["content"]) > 100 else msg["content"]
            print(f"{role_emoji} {msg['role'].title()}: {content}")
        print("-" * 60)

    def interactive_chat(self):
        """Interactive chat interface with agent-based tool selection and history management"""
        print("🤖 Legal AI Agent initialized!")
        print("Features:")
        print("  • Conversation history: Remembers last 4 exchanges")
        print("  • Iterative tool calling: Up to 3 iterations per query")
        print("  • Commands: 'history', 'clear', 'quit'")
        print("\nType your legal questions or commands:")
        print("-" * 50)

        while True:
            user_input = input("\nYou: ").strip()

            if user_input.lower() in ['quit', 'exit', 'bye']:
                print("🤖 Agent: Goodbye!")
                break
            elif user_input.lower() == 'history':
                self.show_history()
                continue
            elif user_input.lower() == 'clear':
                self.clear_history()
                continue

            if not user_input:
                continue

            print(f"\n🤖 Agent: {self.chat_with_agent(user_input)}")
            print("-" * 50)