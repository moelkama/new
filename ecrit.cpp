#include <iostream>
#include <fstream>

int main(void)
{
    std::fstream    out("socket", std::ios::out);
    const char ptr[] = "POST / HTTP/1.1\r\nContent-Type: image/jpg\r\nContent-Length: 256\r\n\r\nelkamal";
    out<<ptr;
}