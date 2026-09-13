# Fast profile refreshes

The profile card refreshes every five minutes and whenever this repository's generator changes. GitHub does not run a profile README as a live application, so a visitor cannot fetch fresh API data directly from the card.

For an immediate refresh after activity in another repository, send a `repository_dispatch` event to `AmanCiphers/amanciphers`:

```sh
curl --request POST \
  --url https://api.github.com/repos/AmanCiphers/amanciphers/dispatches \
  --header "Accept: application/vnd.github+json" \
  --header "Authorization: Bearer $PROFILE_UPDATE_TOKEN" \
  --data '{"event_type":"refresh-profile"}'
```

Create `PROFILE_UPDATE_TOKEN` as a fine-grained personal access token with **Contents: Read and write** access limited to the `amanciphers` repository. Store it as a secret in any repository or automation that sends the request; never commit it. The event starts the existing update workflow immediately, and it commits only when the rendered SVG data changed.
