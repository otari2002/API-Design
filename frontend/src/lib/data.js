'use server';

const BACKEND_URL = process.env.BACKEND_URL;

export async function getProxies(){
    try {
        const response = await fetch(`${BACKEND_URL}/proxy`);

        if (!response.ok) {
            return { status: "error", message: "Failed to fetch proxies" };
        }

        return await response.json();

    } catch (error) {
        console.error('Error during fetching proxies:', error);
        return { status: "error", message: "Failed to fetch proxies" };
    }
}

export async function getProxy(id){
    try {
        const response = await fetch(`${BACKEND_URL}/proxy/${id}`);

        if (!response.ok) {
            return { status: "error", message: "Failed to fetch proxy" };
        }

        return await response.json();

    } catch (error) {
        console.error('Error during fetching proxy:', error);
        return { status: "error", message: "Failed to fetch proxy" };
    }
}

export async function createProxy(newProxy){
    try {
        const response = await fetch(`${BACKEND_URL}/proxy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProxy),
        });
        
        if (!response.ok) {
            return { status: "error", message: "Failed to add proxy" };
        }
        const proxy = await response.json();
        return { status: "success", message: "Proxy added succesfully", proxy: proxy };

    } catch (error) {
        console.error('Error during adding proxy:', error);
        return { status: "error", message: "Failed to add proxy" };
    }
}

export async function updateProxy(id, newProxy){
    try {
        const response = await fetch(`${BACKEND_URL}/proxy/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProxy),
        });

        if (!response.ok) {
            return { status: "error", message: "Failed to update proxy" };
        }

        const modifiedProxy =  await response.json();
        return { status: "success", message: "Proxy updated succesfully", proxy: modifiedProxy };
    } catch (error) {
        console.error('Error during updating proxy:', error);
        return { status: "error", message: "Failed to update proxy" };
    }
}

export async function deleteProxy(id){
    try {
        const response = await fetch(`${BACKEND_URL}/proxy/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            return { status: "error", message: "Failed to delete proxy" };
        }

        return { status: "success", message: "Proxy deleted succesfully" };

    } catch (error) {
        console.error('Error during deleting proxy:', error);
        return { status: "error", message: "Failed to delete proxy" };
    }
}

export async function getBackends(){
    try {
        const response = await fetch(`${BACKEND_URL}/backend`);

        if (!response.ok) {
            return { status: "error", message: "Failed to fetch backends" };
        }

        return await response.json();

    } catch (error) {
        console.error('Error during fetching backends:', error);
        return { status: "error", message: "Failed to fetch backends" };
    }
}

export async function createBackend(backend){
    try {
        const response = await fetch(`${BACKEND_URL}/backend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(backend),
        });

        if (!response.ok) {
            return { status: "error", message: "Failed to add backend" };
        }

        return { status: "success", message: "Backend added succesfully" };

    } catch (error) {
        console.error('Error during adding flow:', error);
        return { status: "error", message: "Failed to add backend" };
    }
}

export async function getFlows() {
    try {
        const response = await fetch(`${BACKEND_URL}/flow`);

        if (!response.ok) {
            return { status: "error", message: "Failed to fetch flows" };
        }

        return await response.json();

    } catch (error) {
        console.error('Error during fetching flows:', error);
        return { status: "error", message: "Failed to fetch flows" };
    }
}

export async function getFlow(id) {
    try {
        const response = await fetch(`${BACKEND_URL}/flow/${id}`);

        if (!response.ok) {
            return { status: "error", message: "Failed to fetch flow" };
        }

        return await response.json();

    } catch (error) {
        console.error('Error during fetching flow:', error);
        return { status: "error", message: "Failed to fetch flow" };
    }
}

export async function createFlow(flow){
    try {
        const response = await fetch(`${BACKEND_URL}/flow`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(flow),
        });
        
        if (!response.ok) {
            return { status: "error", message: "Failed to add flow" };
        }
        const result = await response.json();
        return { status: result.status, message: result.message };

    } catch (error) {
        console.error('Error during adding flow:', error);
        return { status: "error", message: "Failed to add flow" };
    }
}

export async function patchFlow (id, form) {
    try {
      const response = await fetch(`http://localhost:5000/flow/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
        
      if (!response.ok) {
        return { status: "error", message: "Failed to update flow" };
    }
    const result = await response.json();
    return { status: result.status, message: result.message };

    } catch (error) {
        console.error('Error during updating flow:', error);
        return { status: "error", message: "Failed to update flow" };
    }
}

export async function getSubFlows() {
    try {
        const response = await fetch(`${BACKEND_URL}/subflow`);

        if (!response.ok) {
            return { status: "error", message: "Failed to fetch subflows" };
        }

        return await response.json();

    } catch (error) {
        console.error('Error during fetching subflows:', error);
        return { status: "error", message: "Failed to fetch subflows" };
    }
}
