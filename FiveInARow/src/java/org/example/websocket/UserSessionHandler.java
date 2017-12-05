package org.example.websocket;

import java.io.IOException;
import java.util.ArrayList;
import javax.enterprise.context.ApplicationScoped;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.JsonObject;
import javax.json.spi.JsonProvider;
import javax.websocket.Session;
import org.example.model.User;

//Specify the class by adding the @ApplicationScoped annotation and importing its corresponding package.
@ApplicationScoped
public class UserSessionHandler {
    private int userId = 1;
    private int userUId = 1;
    //Declare a HashSet for storing the list of players added to the application.
    private final Set<Session> sessions = new HashSet<>();
    private final Set<User> users = new HashSet<>();
    
    //Defines the methods for adding and removing sessions to the server.
    public void addSession(Session session) {
        sessions.add(session);
        for (User user : users) {
            JsonObject addMessage = createAddMessage(user);
            sendToSession(session, addMessage);
        }
    }

    public void removeSession(Session session) {
        sessions.remove(session);
    }
    
    public List<User> getUsers() {
        return new ArrayList<>(users);
    }
   
    public void addUser(User user) {
        user.setId(userId);
        users.add(user);
        userId++;
        JsonObject addMessage = createAddMessage(user);
        sendToAllConnectedSessions(addMessage);
    }
    
    public void QuitGame(User user) {
        userId=1;
        users.clear();
        JsonObject addMessage = createQuitMessage(user);
        sendToAllConnectedSessions(addMessage);
    }
    
    private JsonObject createQuitMessage(User user) {
        JsonProvider provider = JsonProvider.provider();
        JsonObject addMessage = provider.createObjectBuilder()
        .add("action", "quit")
        .add("id", user.getId())
        .build();
        return addMessage;
    }
    
    public void userMove(User user){
        user.setUId(userUId);
        users.add(user);
        userUId++;
        JsonObject addMessage = createAddMoveMessage(user);
        sendToAllConnectedSessions(addMessage);
        if(user.getCflag()){
            QuitGame(user);
        }
    }

    private JsonObject createAddMoveMessage(User user) {
        JsonProvider provider = JsonProvider.provider();
        JsonObject addMessage = provider.createObjectBuilder()
        .add("action", "move")
        .add("name",user.getName())
        .add("id", user.getUId())
        .add("x", user.getX())
        .add("y",user.getY())
        .add("color",user.getColor())
        .add("cflag",user.getCflag())
        .add("disable",user.getDisable())
        .build();
        return addMessage;
    }
    
    private User getUserById(int id) {
        for (User user : users) {
            if (user.getId() == id) {
                return user;
            }
        }
        return null;
    }

    private JsonObject createAddMessage(User user) {
        JsonProvider provider = JsonProvider.provider();
        JsonObject addMessage = provider.createObjectBuilder()
                .add("action", "add")
                .add("id", user.getId())
                .add("name", user.getName())
                .build();
        return addMessage;
    }

    //Sends the data to all connected clients
    private void sendToAllConnectedSessions(JsonObject message) {
        for (Session session : sessions) {
            sendToSession(session, message);
        }
    }

    private void sendToSession(Session session, JsonObject message) {
         try {
            session.getBasicRemote().sendText(message.toString());
        } catch (IOException ex) {
            sessions.remove(session);
            Logger.getLogger(UserSessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
