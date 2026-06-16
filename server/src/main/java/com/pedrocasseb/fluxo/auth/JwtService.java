package com.pedrocasseb.fluxo.auth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

  @Value("${jwt.secret}")
  private String secret;

  @Value("${jwt.expiration:86400000}") // 24 hours in milliseconds
  private long expiration;

  public String generateToken(String email) {
    Algorithm algorithm = Algorithm.HMAC256(secret);
    return JWT.create()
        .withSubject(email)
        .withExpiresAt(new Date(System.currentTimeMillis() + expiration))
        .withIssuer("fluxo-api")
        .sign(algorithm);
  }

  public String extractUsername(String token) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(secret);
      JWTVerifier verifier = JWT.require(algorithm)
          .withIssuer("fluxo-api")
          .build();
      DecodedJWT decodedJWT = verifier.verify(token);
      return decodedJWT.getSubject();
    } catch (JWTVerificationException e) {
      return null;
    }
  }

  public boolean isTokenValid(String token, String email) {
    String username = extractUsername(token);
    return username != null && username.equals(email) && !isTokenExpired(token);
  }

  private boolean isTokenExpired(String token) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(secret);
      JWTVerifier verifier = JWT.require(algorithm)
          .withIssuer("fluxo-api")
          .build();
      DecodedJWT decodedJWT = verifier.verify(token);
      return decodedJWT.getExpiresAt().before(new Date());
    } catch (JWTVerificationException e) {
      return true;
    }
  }
}
