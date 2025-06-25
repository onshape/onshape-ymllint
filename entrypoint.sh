#!/usr/bin/env bash
set +e

#  Get changed files 
get_changed_files() {
    files=$(git diff --name-only origin/"$github_base_ref"...HEAD |grep -E '\.yaml$|\.yml$' || true)

    if [ -z "$files" ]; then
        echo "No changed .yaml files found."
        exit 0
    fi

    file_list=$(echo "$files" | tr '\n' ' ')
    echo "$file_list"
}

run_yaml_lint(){
    # $1 is the changed files
    local files="$1"
    read -r -a file_list <<< "$files"  # Convert the string to an array
    yamllint -c "$github_action_path"/config/.yamllint -s --format github "${file_list[@]}" > "$(get_tempfile)"
    exit_code="$?"
    echo "$exit_code"
}

get_tempfile() {
    echo "$RUNNER_TEMP/yaml_linter_result.txt"
}

main() {
    echo "Starting YAML Linting..."

    changed_files=$(get_changed_files)
    echo "Changed files: $changed_files"

    echo "Running yamllint..."
    exit_code=$(run_yaml_lint "$changed_files")

    echo "Exit code from yamllint: $exit_code"
    if [ "$exit_code" -eq "0" ]; then
        echo "YAML linting passed with no error."
        exit 0  
    else   
        echo "YAML linting gave errors/warnings."
        cat "$(get_tempfile)"
        exit "$exit_code"
    fi
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  main
fi
