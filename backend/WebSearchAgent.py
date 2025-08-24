import requests
import logging
from typing import List, Dict

class WebSearchAgent:
    """Handles real-time legal information searches"""

    def __init__(self, search_api_key: str):
        self.api_key = search_api_key

    def search_recent_laws(self, query: str, jurisdiction: str = None) -> List[Dict]:
        """Search for recent legal updates and changes"""
        # Enhanced query with legal terms
        legal_query = f"{query} law statute regulation 2024 2025"
        if jurisdiction:
            legal_query += f" {jurisdiction}"

        # Use your preferred search API (Serper, Brave, etc.)
        try:
            response = requests.get(
                "https://google.serper.dev/search?q=apple+inc&apiKey=",
                headers={"X-API-KEY": self.api_key},
                params={"q": legal_query, "num": 5}
            )
            results = response.json()

            # Filter and structure legal sources
            legal_sources = []
            for result in results.get('organic', []):
                if any(domain in result.get('link', '') for domain in
                      ['.gov', 'legislature', 'courts', 'attorney', 'legal']):
                    legal_sources.append({
                        'title': result.get('title'),
                        'url': result.get('link'),
                        'snippet': result.get('snippet'),
                        'source_type': 'official' if '.gov' in result.get('link', '') else 'legal'
                    })

            return legal_sources
        except Exception as e:
            logging.error(f"Web search error: {e}")
            return []
