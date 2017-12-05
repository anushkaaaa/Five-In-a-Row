package org.example.websocket;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.io.StringReader;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.example.model.User; 
//Defines the WebSocket server endpoint path.
@ApplicationScoped
@ServerEndpoint("/actions")

public class UserWebSocketServer {
    //Defines the WebSocket lifecycle annotations by the following methods
    @Inject
    private UserSessionHandler sessionHandler;
    
     @OnOpen
        public void open(Session session) {
            sessionHandler.addSession(session);
    }

    @OnClose
    public void close(Session session) {
        sessionHandler.removeSession(session);
    }

    @OnError
    public void onError(Throwable error) {
        Logger.getLogger(UserWebSocketServer.class.getName()).log(Level.SEVERE, null, error);
    }

    @OnMessage
    public void handleMessage(String message, Session session) {

        try (JsonReader reader = Json.createReader(new StringReader(message))) {
            JsonObject jsonMessage = reader.readObject();

            if ("add".equals(jsonMessage.getString("action"))) {
                User user = new User();
                user.setName(jsonMessage.getString("name"));
                sessionHandler.addUser(user);
            }

            if ("quit".equals(jsonMessage.getString("action"))) {
                User user = new User();
                user.setId(jsonMessage.getInt("id"));
                sessionHandler.QuitGame(user);
            }
            
            if ("move".equals(jsonMessage.getString("action"))) {
                User user = new User();
                user.setX(jsonMessage.getInt("x"));
                user.setY(jsonMessage.getInt("y"));
                user.setColor(jsonMessage.getBoolean("color"));
                user.setDisable(jsonMessage.getBoolean("disable"));
                user.setCflag(jsonMessage.getBoolean("cflag"));
                user.setName(jsonMessage.getString("name"));
                sessionHandler.userMove(user);
            }  
        }
    }
}
