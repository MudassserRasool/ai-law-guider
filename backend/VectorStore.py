from pymongo import MongoClient
from typing import List, Dict
from services.Client import get_client

class VectorStore:
    """MongoDB vector store for country documents"""

    def __init__(self, connection_string: str, db_name: str = "country_db", collection_name: str = "country_embeddings"):
        self.client = MongoClient(connection_string)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    def get_embedding(self, text: str):
        """Generate embedding for query"""
        client = get_client()
        return client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        ).data[0].embedding

    def search_similar(self, query: str, country: str, limit: int = 2) -> List[Dict]:
        """Search for similar text in a given country"""
        query_embedding = self.get_embedding(query)

        # Build pipeline with filter inside vectorSearch
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index",       # must match your Atlas index name
                    "path": "embedding",
                    "queryVector": query_embedding,
                    "filter": {"country": country},  # ✅ filter by country here
                    "numCandidates": limit * 3,
                    "limit": limit
                }
            },
            {
                "$project": {
                    "country": 1,
                    "text": 1,
                    "score": {"$meta": "vectorSearchScore"}
                }
            }
        ]

        results = list(self.collection.aggregate(pipeline))
        print(results)
        return results