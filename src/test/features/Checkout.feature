Feature: Checkout Order

Scenario: Instantiate Checkout
    Given the user has started an order with valid items
    When the user initiates the checkout process
    Then the checkout should be initiated successfully
    And the microservice should return a confirmation with the checkout ID