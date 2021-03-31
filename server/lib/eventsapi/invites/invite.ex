defmodule EventsApi.Invites.Invite do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:status, :email, :id]}

  schema "invites" do
    field :email, :string
    field :status, :string
    belongs_to :meeting, EventsApi.Meetings.Meeting

    timestamps()
  end

  @doc false
  def changeset(invite, attrs) do
    invite
    |> cast(attrs, [:status, :email, :meeting_id])
    |> validate_required([:status, :email, :meeting_id])
  end
end
