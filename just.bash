export JUST_PROJECT_ROOT="`pwd`";

function just_clean {
  rm -rf "$JUST_PROJECT_ROOT/node_modules";
}

function just_run {
  local tab_name;tab_name="${1}";
  [[ -z "$tab_name" ]] && { echo "Must specify tab_name" >&2; return 1; }
  cd "$JUST_PROJECT_ROOT" || return 1;
  node src/index.js "$tab_name";
  cd ~- || return 1;
}
