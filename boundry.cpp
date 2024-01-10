#include <iostream>
#include <map>
#include "macro.hpp"
#include <fstream>

class boundary
{
private:
    std::fstream    out;
    std::string     brest;
    std::map<std::string, std::string> headers;
    bool        h;
public:
    std::string boundry;
    boundary(){this->h = false;}
    void    boundarry(std::string body)
    {
        std::string line;
        size_t      end_line;
        size_t      header_s;
    
        body = this->brest + body;
        while ((end_line = body.find(LINE_SEPARATOR)) != std::string::npos)
        {
            line = body.substr(0, end_line);
            body = body.substr(end_line + strlen(LINE_SEPARATOR));
            if (line == "--boundary_example--")
                return ;//throw (201);
            if (line == "--boundary_example")
                this->h = true;
            else if (line.empty())
            {
                this->h = false;
                this->out.close();
                this->out.open(this->headers["Content-Type"], std::fstream::out);
                // for (std::map<std::string, std::string>::iterator it = this->headers.begin(); it != this->headers.end();it ++)
                //     std::cout<<"key->"<<it->first<<"value->"<<it->second<<std::endl;
            }
            else if (this->h)
            {
                header_s = line.find(HEDER_SEPARATOR);
                if (header_s == std::string::npos)
                    throw (400);// HEADER SEPARATOR NOT FOUND
                this->headers[line.substr(0, header_s)] = line.substr(header_s + strlen(HEDER_SEPARATOR));
            }
            else
            {
                this->out<<line<<std::endl;
                std::cout<<line<<std::endl;
            }
        }
        this->brest = body;
    }
};

int main(void)
{
    boundary    b;

    b.boundry = "boundary_example";
    b.boundarry("--boundary_example\r\nContent-Type: ../post/a\r\n\r\nThis is a text field\r\n--boundary_example\r\nContent-Disposition: form-data; name=file; filename=example.txt\r\nContent-Type: ../post/b\r\n\r\nContents of the text file go here\r\n--boundary_example--\r\n");
}