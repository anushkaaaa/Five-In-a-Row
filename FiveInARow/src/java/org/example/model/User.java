package org.example.model;
public class User {
    private int id;
    private int uid;
    private int x;
    private int y;
    private boolean color;
    private boolean cflag;
    private boolean disable;
    private String name;
    private String status;
    private String type;
    private String description;

//Getters function to get the data from JSON object
    public User() {
    }
    public int getId() {
        return id;
    }
    public int getUId() {
        return uid;
    }
    public String getName() {
        return name;
    }
    public String getStatus() {
        return status;
    }
    public String getType() {
        return type;
    }
    public String getDescription() {
        return description;
    }
    public int getX() {
        return x;
    }
    public int getY() {
        return y;
    }
    public boolean getColor() {
        return color;
    }
    public boolean getCflag() {
        return cflag;
    }
    public boolean getDisable() {
        return disable;
    }
    
// Setters function to set the data to parameter in JSON object
    public void setId(int id) {
        this.id = id;
    }
    public void setUId(int uid) {
        this.uid = uid;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public void setType(String type) {
        this.type = type;
    }
    public void setDescription(String description) {
        this.description = description;
    } 
    public void setX(int x) {
        this.x = x;
    }
    public void setY(int y) {
        this.y = y;
    }
    public void setColor(boolean color) {
        this.color = color;
    }
    public void setCflag(boolean cflag) {
        this.cflag = cflag;
    }
    public void setDisable(boolean disable) {
        this.disable = disable;
    }   
}
