defmodule Pearcode.Lobby do


  # create a new blank lobby
  def new() do
      %{
          body: "",
      }
  end

  def update(st, code) do
      Map.replace(st, :body, code)
  end


end
