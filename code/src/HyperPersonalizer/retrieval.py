import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer


# Load CSV files
df1 = pd.read_csv("data/customer_profiles.csv",encoding="ISO-8859-1")  # Customer Profiles
df2 = pd.read_csv("data/bank_transcation.csv",encoding="ISO-8859-1")  # Transaction History
df3 = pd.read_csv("data/social_media_activity.csv",encoding="ISO-8859-1")  # Sentiment Data

# Merge data on customer_id
merged_df = df1.merge(df2, on="Customer_ID").merge(df3, on="Customer_ID")

# Initialize embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")
column_names = merged_df.columns.tolist()



# text_data = merged_df.apply(lambda
#                                 row: f"Customer {row['Customer_ID']}  ",
#                             axis=1)

#text_data = merged_df.apply(lambda row: {col: row[col] for col in merged_df.columns}, axis=1)
column_names = df1.columns.tolist()

text_data = df1.apply(lambda row: {'Customer_ID': row['Customer_ID'] , 'Preferences': row['Preferences']},axis=1)

# Generate embeddings
embeddings = np.array(model.encode(text_data.to_list()))

# Create FAISS index


dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

# Save FAISS index
faiss.write_index(index, "customer_recommendations.index")

#
def getPreferences(query_text):
    """Retrieve similar customers and pass data to LLM."""
    query_embedding = model.encode([query_text])
    D, I = index.search(np.array(query_embedding,dtype=np.float32), k=1)
    similar_customers = df1.iloc[I[0]]
    return similar_customers.to_json()
    # Send retrieved data to LLM
    # response = ollama.chat(model="gemma3:1b", messages=[
    #     {"role": "system", "content": "You are a financial recommendation AI."},
    #     {"role": "user", "content": f"Provide insights based on this data: {similar_customers.to_json()}"}
    # ])
    # #print(similar_customers.to_json())
    #
    # return {
    #     "query": query_text,
    #     "top_matches": similar_customers.to_dict(orient='records'),
    #     "llm_response": response,
    #     "confidence_scores": D.tolist()
    # }


# Example usage
# query = "A1000"
# #print(get_recommendations(query))
# query_embedding = model.encode([query])
# print(query_embedding,query)
# D, I = index.search(np.array(query_embedding), k=1)
# similar_customers = merged_df.iloc[I[0][0]]
#
# print(D,I)
# l=similar_customers.to_json()
# print(len(l),l)
