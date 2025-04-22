def replace_placeholders(message, user_data):
    # Log the initial message and user_data being passed
    # print("Initial message:", message)
    # print("User data:", user_data)

    for key, value in user_data.items():
        placeholder = f'{{{key}}}'  # Placeholder format is {key}
        # Log the current placeholder and value being replaced
        print(f"Replacing placeholder: {placeholder} with {value}")
        message = message.replace(placeholder, str(value))
    
    # Log the final message after replacement
    print("Final message after placeholder replacement:", message)

    return message
