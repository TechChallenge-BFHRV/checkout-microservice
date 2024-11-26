Feature: Checkout Payment Processing

Scenario: Successfully process a valid payment
    Given the user has initiated the checkout process
    And the checkout process returned a valid checkout ID
    When the user provides payment details and the payment gateway confirms the transaction
    Then the microservice should return a success response with status “Approved”