package kth.User_MS.controller;

import kth.User_MS.Model.User;
import kth.User_MS.Model.UserResponse;
import kth.User_MS.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins ="http://localhost:3000")

public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @PostMapping("/register")
    public ResponseEntity<User> creatUser(@RequestBody User user){
        User creatUser= userService.createUser(user);
        return ResponseEntity.ok(creatUser);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> loginUser(@RequestBody User user) {
        boolean loginSuccessful = userService.loginUser(user);

        if (loginSuccessful) {
            UserResponse userDetails = userService.getUserDetails(user.getUsername());

            return ResponseEntity.ok(userDetails);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
}
