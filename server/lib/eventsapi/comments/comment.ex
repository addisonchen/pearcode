defmodule EventsApi.Comments.Comment do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:body, :user_id, :id, :user]}

  schema "comments" do
    field :body, :string
    belongs_to :user, EventsApi.Users.User
    belongs_to :meeting, EventsApi.Meetings.Meeting

    timestamps()
  end

  @doc false
  def changeset(comment, attrs) do
    comment
    |> cast(attrs, [:body, :user_id, :meeting_id])
    |> validate_required([:body, :user_id, :meeting_id])
  end
end
