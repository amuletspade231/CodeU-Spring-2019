package com.google.codeu.data;

import java.util.Optional;

public class User {

  private String email;
  private String aboutMe;
  private boolean isTakingCommissions;

  public User(String email, String aboutMe, Optional<Boolean> isTakingCommissions) {
    this.email = email;
    this.aboutMe = aboutMe;
    this.isTakingCommissions = isTakingCommissions.orElse(false);
  }

  public String getEmail(){
    return email;
  }

  public String getAboutMe() {
    return aboutMe;
  }

  public boolean getIsTakingCommissions() {
    return isTakingCommissions;
  }
}
