from datasets import load_dataset

_dataset = None
_dataframe = None

def load_job_dataset():
    global _dataset, _dataframe

    if _dataframe is None:
        _dataset = load_dataset("xanderios/linkedin-job-postings")
        _dataframe = _dataset["train"].to_pandas()

    return _dataframe


def get_role_descriptions(role_name, limit=50):
    df = load_job_dataset()

    filtered = df[df["title"].str.contains(role_name, case=False, na=False)]
    filtered = filtered.head(limit)

    descriptions = " ".join(filtered["description"].dropna().tolist())

    return descriptions
