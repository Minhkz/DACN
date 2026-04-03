package com.haui.dto.response.jwt;

import com.haui.entity.User;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";


    public JwtResponse(String accessToken,  String refreshToken) {
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
    }


}
