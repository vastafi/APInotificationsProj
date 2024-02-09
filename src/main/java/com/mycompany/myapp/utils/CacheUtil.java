package com.mycompany.myapp.utils;

import com.mycompany.myapp.domain.User;
import java.util.HashSet;
import java.util.Set;

public class CacheUtil {

    private CacheUtil() {}

    public static Set<User> usersCache = new HashSet<>();
}
