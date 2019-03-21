package com.google.codeu.data;
import java.util.UUID;

public class RegexExample {
  public static void main(String[] args) {
    String regex = "(https?://\\S+\\.(png|jpg|gif))";
    String replacement = "<img src=\"$1\" />";
    
    String text = "Here is an image: https://www.youtube.com/watch?v=ETGDCEXnkDM";

   String youtube_regex = "(https://www.youtube.com/watch\\?v=(\\S*))";
   String youtube_replacement = "<iframe width=\"560\" height=\"315\" "+
   "src=\"https://www.youtube.com/embed/$2\" frameborder=\"0\" "+
   "allow=\"accelerometer; autoplay; encrypted-media; gyroscope; "+
   "picture-in-picture\" allowfullscreen></iframe>";

    String result = text.replaceAll(youtube_regex, youtube_replacement);
    System.out.println(result);
  }
}