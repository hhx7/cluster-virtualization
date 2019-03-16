package com.hhx7.cvserver.entity;

public class Wrapper<T> {
    private T value;

    public T getValue() {
        return value;
    }

    public void setValue(T value) {
        this.value = value;
    }


}
