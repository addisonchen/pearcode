defmodule EventsApi.Meetings.Meeting do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:date, :description, :name, :id]}

  schema "meetings" do
    field :date, :utc_datetime
    field :description, :string
    field :name, :string
    belongs_to :user, EventsApi.Users.User

    has_many :invites, EventsApi.Invites.Invite, on_delete: :delete_all
    has_many :comments, EventsApi.Comments.Comment, on_delete: :delete_all

    timestamps()
  end

  @doc false
  def changeset(meeting, attrs) do
    meeting
    |> cast(attrs, [:name, :date, :user_id, :description])
    |> validate_required([:name, :date, :user_id, :description])
  end
end
