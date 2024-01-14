OBJ = main.o request.o post.o respons.o cgi.o client_class.o ./last/config_file/configFile.o 

NAME = mkatfi
CXX = c++
CXXFLAGS = #-Wall -Wextra -Werror -std=c++98

all : $(NAME)

$(NAME) : $(OBJ)
	$(CXX) $(CXXFLAGS) $(OBJ) -o $(NAME)

clean:
	rm -f $(OBJ)

fclean: clean
	rm -f $(NAME)

re: fclean all

rm:
	rm ../post/*

run: all clean
	# rm -f ../post/*
	./$(NAME) ./last/config_file/c.conf
out:
	./$(NAME) ./last/config_file/c.conf

.PHONY: all clean fclean re