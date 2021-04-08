defmodule PearcodeWeb.SubmissionController do
  use PearcodeWeb, :controller

  def receive_webhook(conn, params) do
      IO.puts "=========== RECEIVED CONN ============="
      IO.inspect conn

      lobby_id = conn.path_params["lobby_id"]
      user_id = conn.path_params["user_id"]

      headers = ["Content-Type": "application/json", "X-Auth-Token": "phut1Vahgh9faik4oire"]
      url = "http://localhost:2358/submissions/#{params["token"]}?base64_encoded=false"
      resp = HTTPoison.get!(url, headers, [])
      body = Jason.decode!(resp.body)
      IO.puts "=========== RESP BODY ============="
      IO.inspect body
      # IDEA:
      body = Map.puts(body, :user_id, user_id)
      PearcodeWeb.Endpoint.broadcast!("lobby:#{lobby_id}", "submission_result", body)
      # in the lobby_channel, intercept the broadcast and compare user name, then broadcast to your channel if the name is correct
      conn
      |> resp(400, "ok")
      |> send_resp
  end
end
