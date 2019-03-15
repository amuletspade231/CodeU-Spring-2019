package com.google.codeu.data;
import java.util.UUID;

public class RegexExample {
  public static void main(String[] args) {
    String regex = "(https?://\\S+\\.(png|jpg|gif))";
    String replacement = "<img src=\"$1\" />";
    
    String text = "Here is an image: https://example.com/images/cat.jpg";
    
    String result = text.replaceAll(regex, replacement);
    System.out.println(result);
  }
}