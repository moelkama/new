from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from authentication.serializers import UserSerializer

class UserDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

class UserUpdateView(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDeleteView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({'success': 'User deleted'}, status=status.HTTP_200_OK)
    

class DeactivateUser(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user.is_active = False
        user.save()
        return Response({'success': 'User deactivated'}, status=status.HTTP_200_OK)
