defmodule EventsApi.Repo do
  use Ecto.Repo,
    otp_app: :eventsapi,
    adapter: Ecto.Adapters.Postgres
end
