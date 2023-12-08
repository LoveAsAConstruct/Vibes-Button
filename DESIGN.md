# DESIGN CHOICES

## Apology for Code Implementation

I sincerely apologize for the specific implementation found in "server-side/templates/post_register.html" at line 10, column 18. Originally, I attempted to implement a more sophisticated handshake method, as the content script insertion was occurring after the execution of the HTML's JavaScript. This led to synchronization issues. However, I encountered unexpected security errors with the handshake approach and, as a result, had to default to a less elegant solution—a 1-second delay to sync the extension and session storage. This workaround, while functional, is far from ideal and certainly not best practice. It should definitely be improved upon after a more thorough investigation into Chrome's extension storage security protocols.

## Chrome Extension Storage and User Login

One of the most challenging aspects of this project was managing the storage in sync with user login state, which involved coordinating between the server-side application and the Chrome extension. This mechanism primarily relies on a session `user_id` variable within the Flask application, paired with an extension variable stored within Google Chrome's extension API. These critical variables are kept in sync through various user actions, including login, logout, and registry. The rationale behind implementing user authentication was twofold: firstly, to log user activity for monitoring purposes, and secondly, to lay the groundwork for a potential billing system, should this extension be released publicly. For the scope of this project, all operations were confined locally to the user's computer, which not only streamlined the testing process but also eliminated the need for external hosting services.

## Handling User IDs and Guest Access

A novel approach was adopted for handling user IDs, especially when users log out. Instead of removing the `user_id` value within the Chrome extension, it's set to -1. This serves as a unique identifier for a "guest" user. This design choice ensures that the functionality of the extension remains accessible even when a user opts not to remain logged in. As a result, once a user has registered or logged into an account at least once, they can continue to use the extension in a more anonymous 'guest' mode, promoting both usability and privacy.

## Chrome Extension Design and User Experience

The design of the Chrome extension was kept simple and user-friendly—an orange button located at the bottom right of the page. This placement was chosen to align with mainstream standards, as observed in popular overlay extensions like Grammarly, which suggests that such positioning is likely optimal for user accessibility and comfort. Future iterations of the design will include features to enhance user experience, such as making the button movable and allowing users to customize its location on their screen, providing a more personalized interaction that doesn't solely rely on website developers' standards.

## API Calls and Model Selection

The functionality of the orange button is quite sophisticated; upon clicking, it sends an API call to the OpenAI database. This call utilizes a custom-tuned model that I developed, drawing upon the prompt structures found in "development/training3.jsonl". The model operates within a Babbage framework, a strategic choice that balances cost-effectiveness with the fidelity of the output. When coding, I made sure to keep the model ID dynamic, which paves the way for future enhancements such as allowing users to switch between different model fidelities and fine-tuning parameters via the Flask app interface. This feature could significantly enhance user experience by providing more tailored responses.

## API Logging for Model Improvement

A key feature of this project is its API logging functionality. The primary goal here is to gather a rich dataset to train a larger, more accurate model in the future. The current model's significant shortcoming is in its response formatting—errors that I plan to address by enriching the training set with a wider array of prompts. The idea is to reinforce the double bracket response format, enhancing the model's ability to generate more precise and contextually relevant responses. This improvement is crucial for increasing the overall reliability and utility of the application.

# If you have time, check out "/This was CS50.txt"