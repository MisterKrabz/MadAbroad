package com.patrickwang.MadAbroad.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.patrickwang.MadAbroad.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Finds a user by their unique Microsoft Object ID (oid).
     * @param microsoftOid The oid from the Microsoft identity token.
     * @return An Optional containing the user if found.
     */
    Optional<User> findByMicrosoftOid(String microsoftOid);

    /**
     * Finds a user by their email address.
     * @param email The user's email.
     * @return An Optional containing the user if found.
     */
    Optional<User> findByEmail(String email);
}