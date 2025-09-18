export JUST_PROJECT_ROOT="`pwd`";

function just_clean {
  rm -rf "$JUST_PROJECT_ROOT/node_modules";
}

function just_run {
  local tab_path;tab_path="${1}";
  [[ -z "$tab_path" ]] && { echo "Must specify tab_path" >&2; return 1; }
  cd "$JUST_PROJECT_ROOT" || return 1;
  node src/index.js "$tab_path";
  cd ~- || return 1;
}
