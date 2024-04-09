import { IncomingMessage, ServerResponse } from "http";
import { database } from "./model";
import { renderTemplate } from "./view";
import { getSession } from "./session";

export const getHome = async (req: IncomingMessage, res: ServerResponse) => {
    /**
     * 1. Get the session object from the request using the getSession function.
     * 2. Set the response status code to 200.
     * 3. Set the response header "Content-Type" to "text/html".
     * 4. Set the response header "Set-Cookie" to the session id.
     * 5. End the response by rendering the HomeView template.
     */

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(
        await renderTemplate("src/views/HomeView.hbs", {
            title: "Welcome Guest!",
        }),
    );
};

export const login = async (req: IncomingMessage, res: ServerResponse) => {
    /**
     * 1. Get the session object from the request using the getSession function.
     * 2. Parse the request body to get the user's name.
     * 3. Set the session data isLoggedIn to true.
     * 4. Set the session data name to the user's name.
     * 5. Set the response status code to 303.
     * 6. Set the response header "Location" to "/".
     * 7. Set the response header "Set-Cookie" to the session id.
     * 8. End the response.
     */

    res.statusCode = 303;
    res.setHeader("Location", "/");
    res.end();
};

export const getAllPokemon = async (
    req: IncomingMessage,
    res: ServerResponse,
) => {
    /**
     * 1. Get the session object from the request using the getSession function.
     * 2. Set the response status code to 200.
     * 3. Set the response header "Content-Type" to "text/html".
     * 4. Set the response header "Set-Cookie" to the session id.
     * 5. End the response by rendering the ListView template.
     *    Pass the title "All Pokemon", the database of pokemon, and the session data isLoggedIn.
     * 6. In ListView.hbs, only display the form to create a new pokemon if the user is logged in.
     */

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(
        await renderTemplate("src/views/ListView.hbs", {
            title: "All Pokemon",
            pokemon: database,
        }),
    );
};

export const logout = async (req: IncomingMessage, res: ServerResponse) => {
    /**
     * 1. Get the session object from the request using the getSession function.
     * 2. Set the cookie to expire by setting the Expires attribute to a date in the past.
     * 3. Set the response status code to 303.
     * 4. Set the response header "Location" to "/".
     * 5. Set the response header "Set-Cookie" to the session id with the expiration date.
     * 6. End the response.
     */

    res.statusCode = 303;
    res.setHeader("Location", "/");
    res.end();
};

export const createPokemon = async (
    req: IncomingMessage,
    res: ServerResponse,
) => {
    /**
     * Before adding the Pokemon, check if the user is logged in.
     * If not, set the response status code to 401 Unauthorized.
     * Render the ErrorView template or send a message "You must
     * be logged in to view this page" depending on the user-agent.
     *
     * Finally, grab the session and set the session cookie.
     */

    const body = await parseBody(req);
    const newPokemon = {
        id: database.length + 1, // ID "auto-increment".
        name: body.name,
        type: body.type,
    };

    database.push(newPokemon);

    res.statusCode = 303;
    res.setHeader("Location", "/pokemon");
    res.end();
};

const parseBody = async (req: IncomingMessage) => {
    return new Promise<Record<string, string>>((resolve) => {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            let parsedBody: Record<string, string>;

            if (
                req.headers["content-type"]?.includes("x-www-form-urlencoded")
            ) {
                // application/x-www-form-urlencoded => name=Pikachu&type=Electric
                parsedBody = Object.fromEntries(
                    new URLSearchParams(body).entries(),
                );
            } else {
                // application/json => {"name":"Pikachu","type":"Electric"}
                parsedBody = JSON.parse(body);
            }

            resolve(parsedBody);
        });
    });
};
