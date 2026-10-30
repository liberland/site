<?php
/**
 * Spouští plugin bez WordPressu: nahradí potřebné funkce WP jednoduchými stuby
 * a ověří, co plugin vypíše na stránce /o-spolku/ a co na jiné stránce.
 * Použití: php reformy-cz/tests/plugin-smoke.php
 */
define( 'ABSPATH', __DIR__ );
$GLOBALS['rz_hooks'] = array();
$GLOBALS['rz_is_page'] = false;
$GLOBALS['rz_styles'] = array();
$GLOBALS['rz_removed'] = array();

function add_action( $h, $cb, $p = 10, $a = 1 ) { $GLOBALS['rz_hooks'][ $h ][] = array( $cb, $p ); }
function add_filter( $h, $cb, $p = 10, $a = 1 ) { add_action( $h, $cb, $p, $a ); }
function run( $h, $v = null ) {
	$list = isset( $GLOBALS['rz_hooks'][ $h ] ) ? $GLOBALS['rz_hooks'][ $h ] : array();
	usort( $list, function ( $a, $b ) { return $a[1] <=> $b[1]; } );
	foreach ( $list as $e ) { $r = call_user_func( $e[0], $v ); if ( null !== $v ) { $v = $r; } }
	return $v;
}
function is_page( $slug ) { return $GLOBALS['rz_is_page'] && 'o-spolku' === $slug; }
function plugin_dir_path( $f ) { return dirname( $f ) . '/'; }
function plugins_url( $p, $f ) { return 'https://reformy.cz/wp-content/plugins/reformy-o-spolku/' . $p; }
function wp_enqueue_style( $h, $src, $deps, $ver ) { $GLOBALS['rz_styles'][ $h ] = $src . '?ver=' . $ver; }
function remove_filter( $h, $cb ) { $GLOBALS['rz_removed'][] = "$h:$cb"; }
function esc_attr( $s ) { return htmlspecialchars( $s, ENT_QUOTES, 'UTF-8' ); }
function apply_filters( $h, $v ) { return $v; }
function wp_json_encode( $d, $o = 0 ) { return json_encode( $d, $o ); }

require dirname( __DIR__ ) . '/plugin/reformy-o-spolku/reformy-o-spolku.php';

$fail = 0;
function check( $ok, $msg ) { global $fail; echo ( $ok ? 'PASS ' : 'FAIL ' ) . $msg . "\n"; if ( ! $ok ) { $fail++; } }

// Jiná stránka: plugin nesmí nic změnit.
$GLOBALS['rz_is_page'] = false;
run( 'wp_enqueue_scripts' ); run( 'wp' );
ob_start(); run( 'wp_head' ); $head = ob_get_clean();
check( '' === $head, 'jiná stránka: wp_head nic nevypisuje' );
check( empty( $GLOBALS['rz_styles'] ), 'jiná stránka: žádné CSS' );
check( empty( $GLOBALS['rz_removed'] ), 'jiná stránka: wpautop zůstává' );
check( array( 'page' ) === run( 'body_class', array( 'page' ) ), 'jiná stránka: body_class beze změny' );
check( 'O nás | Reformy.cz' === run( 'wp_title', 'O nás | Reformy.cz' ), 'jiná stránka: titulek beze změny' );

// Stránka o-spolku.
$GLOBALS['rz_is_page'] = true;
run( 'wp_enqueue_scripts' ); run( 'wp' );
ob_start(); run( 'wp_head' ); $head = ob_get_clean();
check( isset( $GLOBALS['rz_styles']['reformy-o-spolku'] ), 'o-spolku: CSS zařazeno' );
check( in_array( 'the_content:wpautop', $GLOBALS['rz_removed'], true ), 'o-spolku: wpautop vypnuto' );
check( in_array( 'rz-o-spolku', run( 'body_class', array( 'page' ) ), true ), 'o-spolku: třída rz-o-spolku' );
check( 'O spolku – Reformy.cz z.s.' === run( 'wp_title', 'O spolku | Reformy.cz' ), 'o-spolku: titulek (wp_title)' );
check( 'O spolku – Reformy.cz z.s.' === run( 'pre_get_document_title', '' ), 'o-spolku: titulek (title-tag)' );
check( 1 === substr_count( $head, '<meta name="description"' ), 'o-spolku: jedna meta description' );
preg_match( '#<script type="application/ld\+json">(.*?)</script>#s', $head, $m );
$ld = isset( $m[1] ) ? json_decode( $m[1], true ) : null;
check( is_array( $ld ), 'o-spolku: JSON-LD je platný JSON' );
$org = $ld['@graph'][0];
check( 'NGO' === $org['@type'] && 'Reformy.cz z.s.' === $org['legalName'], 'JSON-LD: NGO + legalName' );
check( '22874046' === $org['identifier']['value'], 'JSON-LD: IČO' );
check( 'Loretánské náměstí 109/3' === $org['address']['streetAddress'] && '118 00' === $org['address']['postalCode'], 'JSON-LD: adresa' );
check( false === strpos( $m[1], 'gov.ll.land' ), 'JSON-LD: žádné tvrzení o gov.ll.land' );
check( false !== strpos( $m[1], 'náměstí' ), 'JSON-LD: čeština bez \\u escapování' );
echo $fail ? "\n$fail selhalo\n" : "\nVše prošlo\n";
exit( $fail ? 1 : 0 );
