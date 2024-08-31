function deleteInput(inputs, path) {
    if (path.length === 0) {
      throw new Error('Path cannot be empty');
    }
  
    // Recursive function to traverse the inputs
    function traverseAndDelete(node, pathIndex) {
      const index = path[pathIndex];
  
      if (pathIndex === path.length - 1) {
        // If we're at the end of the path, delete the input
        node.splice(index, 1);
      } else {
        // Otherwise, keep traversing
        if (node[index] && Array.isArray(node[index].children)) {
          traverseAndDelete(node[index].children, pathIndex + 1);
        } else {
          throw new Error(`Invalid path at index ${index}: ${path.slice(0, pathIndex + 1).join(' -> ')}`);
        }
      }
    }
  
    // Start the recursion from the BODY array
    traverseAndDelete(inputs.BODY, 0);
  }
  
  // Example usage:
  const inputs = {
    "BODY": [
      {
        "name": "list",
        "type": "ARRAY",
        "validation": "",
        "source": "BODY",
        "children": [
          {
            "name": "",
            "type": "BOOLEAN",
            "validation": "",
            "source": "BODY",
            "children": []
          }
        ]
      },
      {
        "name": "obj",
        "type": "OBJECT",
        "validation": "",
        "source": "BODY",
        "children": [
          {
            "name": "name",
            "type": "STRING",
            "validation": "",
            "source": "BODY",
            "children": []
          },
          {
            "name": "objChild",
            "type": "OBJECT",
            "validation": "",
            "source": "BODY",
            "children": []
          }
        ]
      }
    ],
    "HEADER": [],
    "QUERY": []
  };
  
  // Path to 'objChild' (1 -> 1 in BODY array)
  const path = [1];
  
  // Deleting the input
  deleteInput(inputs, path);
  
  console.log(JSON.stringify(inputs, null, 2));
  