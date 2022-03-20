export JUST_PROJECT_ROOT="`pwd`";

function just_clean {
  rm -rf "$JUST_PROJECT_ROOT/node_modules";
}
