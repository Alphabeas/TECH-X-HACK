from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def analyze_profile(request):
    return Response({"message": "Career Navigator API Running"})
