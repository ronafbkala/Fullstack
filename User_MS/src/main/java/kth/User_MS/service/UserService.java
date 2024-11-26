package kth.User_MS.service;


import kth.User_MS.Model.User;
import kth.User_MS.Model.UserResponse;
import kth.User_MS.Model.UserType;
import kth.User_MS.interfaces.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    //private final IUserRepo _userRepository;
    @Autowired
    private IUserRepository _userRepository;


    UserService(){}
    public List<User> getAllUsers(){
        return _userRepository.findAll();
    }

    public User createUser(User user) {
        user.setUserType(UserType.valueOf(user.getUserType().name()));
        return _userRepository.save(user);
    }
    public boolean loginUser(User user) {
        // This is a very basic example, you should replace it with proper authentication logic.
        User existingUser = _userRepository.findByUsername(user.getUsername());
        return existingUser != null && existingUser.getPassword().equals(user.getPassword());
    }

    public UserResponse getUserDetails(String username) {
        User user = _userRepository.findByUsername(username);

        if (user != null) {
            UserResponse userResponse = new UserResponse();
            userResponse.setId(user.getId());
            userResponse.setUsername(user.getUsername());
            userResponse.setUserType(user.getUserType().name()); // Assuming UserType is an enum

            return userResponse;
        } else {
            // Handle case when user is not found, return null or throw an exception
            return null;
        }    }

    public User getUserByUsername(String username) {
        return _userRepository.findByUsername(username);
    }
}
