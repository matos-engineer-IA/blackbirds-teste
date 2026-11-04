#!/bin/sh
set -eu

# The official Nginx entrypoint runs this as the image's unprivileged user.
# Supply a crypt/htpasswd hash through runtime configuration, never a plaintext
# password in the repository, frontend bundle or image layers.
umask 077
auth_dir=/tmp/blackbird-nginx
mkdir -p "$auth_dir"
chmod 700 "$auth_dir"
auth_user=${BLACKBIRD_AUTH_USER:-}
auth_hash=${BLACKBIRD_AUTH_PASSWORD_HASH:-}

if [ -z "$auth_user" ] && [ -z "$auth_hash" ]; then
    printf 'auth_basic off;\n' > "$auth_dir/auth.conf"
    exit 0
fi

case "$auth_user" in
    ''|*[!A-Za-z0-9_.-]*)
        echo 'Black Bird: invalid or incomplete authentication configuration.' >&2
        exit 1
        ;;
esac
if [ "${#auth_user}" -gt 64 ] || [ "${#auth_hash}" -gt 256 ]; then
    echo 'Black Bird: invalid authentication configuration length.' >&2
    exit 1
fi
case "$auth_hash" in
    *[!A-Za-z0-9./\$]*)
        echo 'Black Bird: unsupported password hash format.' >&2
        exit 1
        ;;
esac
case "$auth_hash" in
    '$6$'*|'$apr1$'*|'$2y$'*) ;;
    *)
        echo 'Black Bird: a supported crypt/htpasswd password hash is required.' >&2
        exit 1
        ;;
esac

printf '%s:%s\n' "$auth_user" "$auth_hash" > "$auth_dir/htpasswd"
cat > "$auth_dir/auth.conf" <<'NGINX'
auth_basic "Black Bird - demonstracao";
auth_basic_user_file /tmp/blackbird-nginx/htpasswd;
NGINX
