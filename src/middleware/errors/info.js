export const generateProductErrorAttributes = (product) => {  
  const { title, description, code, price, stock, category } = product;
  return `One or more arguments were incomplete or not valid.
    List of required arguments:
       *Title: needs to be string, recived: ${title}
       *Description: needs to be string, recived: ${description}
       *Code: needs to be string, recived: ${code}
       *Price: needs to be string, recived: ${price}
       *Stock: needs to be number, recived: ${stock}
       *Category: needs to be string, recived: ${category}`;
};

export const generateProductErrorIdNotFound = (id) => {
    return ` The product ID doesn't exist or the id '${id}' does not meet the required format`
}