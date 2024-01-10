#include "client_class.hpp"
#include "./last/config_file/configFile.hpp"
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <sys/types.h>
#include <fcntl.h>

int main(int c, char **v)
{
    if (c != 2)
    {
        std::cout << "Error: wrong number of arguments" << std::endl;
        return 1;
    }
    manyServer *server = new manyServer(v[1]);
    int server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket == -1)
    {
        std::cerr << "Error: Socket creation failed\n";
        return 1;
    }
    int reuse = 1;
    int result = setsockopt(server_socket, SOL_SOCKET, SO_REUSEADDR, (void *)&reuse, sizeof(reuse));
    if ( result < 0 ) {
        perror("ERROR SO_REUSEADDR:");
    }

    sockaddr_in server_address;
    server_address.sin_family = AF_INET;       // IPv4
    server_address.sin_addr.s_addr = INADDR_ANY;  // Accept connections from any IP
    server_address.sin_port = htons(8080);    // Port to listen on (in network byte order)

    if (bind(server_socket, (struct sockaddr *)&server_address, sizeof(server_address)) < 0)
    {
        std::cerr << "Error: Binding failed\n";
        return 1;
    }

    if (listen(server_socket, 5) < 0) {
        std::cerr << "Error: Listen failed\n";
        return 1;
    }

    std::cout << "Server is listening on port 8080...\n";

    int client_socket;
    sockaddr_in client_address;
    socklen_t client_addr_size = sizeof(client_address);
    client_socket = accept(server_socket, (struct sockaddr *)&client_address, &client_addr_size);
    std::cout << "Connection established with a client\n";
    if (client_socket < 0)
    {
        std::cerr << "Error: Accept failed\n";
        return 1;
    }
    std::cout << "Connected to the server\n";

    char    buffer[BUFFER_SIZE + 1];
    size_t  x;
    client  client;

    std::cout<<"-------------"<<std::endl;
    try
    {
        do
        {
            memset(buffer, 0, BUFFER_SIZE + 1);
            x = read(client_socket, buffer, BUFFER_SIZE);
            std::cout<<std::string("").append(buffer, x);
            if (client.request.parse_request(std::string("").append(buffer, x)))
            {
                if (client.request.get_method() == "POST")
                    client.post.post_request(client.request);
                else
                    throw (405);
            }
        }while (x == BUFFER_SIZE);
    }
    catch(int status)
    {
        std::cout<<"status : "<<status<<std::endl;
        client.respons.set_Status(status);
        // client.cgi_out();//webser config
        write(client_socket, client.respons.prepare_respons().c_str(), client.respons.prepare_respons().length());
    }
    catch(...){std::cout<<"ERRRROOROROOROROOROROO"<<std::endl;}
    close(client_socket);
    close(server_socket);
    (void)server;
    return 0;
}