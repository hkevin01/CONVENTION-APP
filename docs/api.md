# API Documentation

This document provides an overview of the REST API endpoints for the Convention App backend.

For the full API schema, see [openapi.yaml](./openapi.yaml).

## Authentication

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive a JWT

## Events

- `GET /api/events` — List all events
- `POST /api/events` — Create a new event

## Announcements

- `GET /api/announcements` — List announcements
- `POST /api/announcements` — Create an announcement

## User Profile

- `GET /api/profile` — Get user profile (JWT required)
- `PUT /api/profile` — Update user profile (JWT required)

## Ticketing

- `POST /api/tickets/checkin` — Check in with a ticket

---

For detailed request/response formats, authentication requirements, and error codes, see the [OpenAPI schema](./openapi.yaml).
