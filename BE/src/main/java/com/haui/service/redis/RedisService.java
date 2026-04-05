package com.haui.service.redis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService {
    @Autowired
    private StringRedisTemplate redisTemplate;

    // CREATE
    public void save(String key, String value) {
        redisTemplate.opsForValue().set(key, value);
    }

    // CREATE với TTL
    public void saveWithTTL(String key, String value, long timeoutSeconds) {
        redisTemplate.opsForValue().set(key, value, timeoutSeconds, TimeUnit.SECONDS);
    }

    // READ
    public String get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    // UPDATE
    public void update(String key, String value) {
        redisTemplate.opsForValue().set(key, value);
    }

    // DELETE
    public Boolean delete(String key) {
        return redisTemplate.delete(key);
    }

    // CHECK KEY EXISTS
    public Boolean exists(String key) {
        return redisTemplate.hasKey(key);
    }
}
