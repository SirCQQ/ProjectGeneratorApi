

class Basic_Class_Template{

/* Generation test */

/* Private variables and functios */
private:
	char Variable_name5;
	char Variable_name6;
	char Variable_name7;
	char Variable_name8;


/* Public variables and functions  */
public:
	char Variable_name1;
	char Variable_name2;
	char Variable_name3;
	char Variable_name4;


	Basic_Class_Template(char Variable_name5,char Variable_name6,char Variable_name7,char Variable_name8,char Variable_name1,char Variable_name2,char Variable_name3,char Variable_name4){
		this->Variable_name5=Variable_name5;
		this->Variable_name6=Variable_name6;
		this->Variable_name7=Variable_name7;
		this->Variable_name8=Variable_name8;
		this->Variable_name1=Variable_name1;
		this->Variable_name2=Variable_name2;
		this->Variable_name3=Variable_name3;
		this->Variable_name4=Variable_name4;
	}
/* Getters */

	char get_Variable_name5(){
		return this->Variable_name5;
	}
	char get_Variable_name6(){
		return this->Variable_name6;
	}
	char get_Variable_name7(){
		return this->Variable_name7;
	}
	char get_Variable_name8(){
		return this->Variable_name8;
	}


/* Setters */

	void set_Variable_name5(char Variable_name5){
		this->Variable_name5=Variable_name5;
	}
	void set_Variable_name6(char Variable_name6){
		this->Variable_name6=Variable_name6;
	}
	void set_Variable_name7(char Variable_name7){
		this->Variable_name7=Variable_name7;
	}
	void set_Variable_name8(char Variable_name8){
		this->Variable_name8=Variable_name8;
	}


/* Destructor */

	~Basic_Class_Template(){} 
};


