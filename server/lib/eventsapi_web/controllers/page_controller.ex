defmodule EventsApiWeb.PageController do
  use EventsApiWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
