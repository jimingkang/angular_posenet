package com.example.demo;

import java.util.*;

public class Customer{
    private String name;
    private List<Order> orders = new ArrayList<>();

    public Customer(String name) {
        this.name = name;
    }

    public String getName() { return name; }
    public List<Order> getOrders() { return orders; }

    public Customer addOrder(Order order) {
        orders.add(order);
        return this;
    }
}

 class Order {
    private int id;

    public Order(int id) {
        this.id = id;
    }

    public int getId() { return id; }
    public String toString() {
    	return String.valueOf(id);
    }
   
}