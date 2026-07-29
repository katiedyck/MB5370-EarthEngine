//************************************************************************//
// MB5370 Earth Engine Module: Workshop 1 //
//************************************************************************//

// 2 forward slashes for comments.

/* Multi line
comment. */

print("Hello world!")

//
// VARIABLES are used to store objects, and are defined using the keyword var.
var the_answer = 42; //number
print(the_answer);
print("The answer is", 42);

var city = "San Francisco";
print(city);

var population = 846249;
print(population);
print('The value for the population variable is:', population);

//
// LISTS store multiple values in a single variable.
var cities = ["San Francisco", "New York", "Atlanta", "Orlando"];
print(cities);

//
// OBJECTS
//
/* Objects in JavaScript allow you to store key-value pairs, where each value
can be referred to by its key. You can create a dictionary using the curly braces {}. */
var cityData = {
  "city": "San Francisco",
  "coordinates": [-122.4194, 37.7749],
  "population": 873965
};
print(cityData);
// Each item has a label. This is known as the key and can be used to retrieve the value of an item.

var cityData2 = {
  "city": "Orlando",
  "coordinates": [28.54, -81.38],
  "population": 333888
};
print(cityData2);

//
// FUNCTIONS
var my_hello_function = function(string) {
  return "Hello " + string + "!";
};
print(my_hello_function("world"));

var greet = function(name) {
  return "Hello " + name;
};
print(greet("World"));
print(greet("Readers"));

