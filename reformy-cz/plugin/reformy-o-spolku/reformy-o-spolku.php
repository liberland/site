<?php
/**
 * Plugin Name:       Reformy.cz – O spolku
 * Description:       Styly, meta description a strukturovaná data (NGO) pro stránku /o-spolku/. Nic dalšího na webu nemění; deaktivací se vše vrátí do původního stavu.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Reformy.cz z.s.
 * License:           GPL-2.0-or-later
 * Text Domain:       reformy-o-spolku
 */

defined( 'ABSPATH' ) || exit;

const RZ_SPOLEK_SLUG    = 'o-spolku';
const RZ_SPOLEK_VERSION = '1.0.0';

/** Platí jen pro stránku se slugem o-spolku (a její náhled v administraci). */
function rz_spolek_is_page() {
	return is_page( RZ_SPOLEK_SLUG );
}

/** Popis pro vyhledávače; stejný text jako v návrhu. */
function rz_spolek_description() {
	return 'Reformy.cz z.s. je český neziskový spolek pro ekonomické vzdělávání a šíření myšlenek svobody a tržního hospodářství. IČO 22874046, sídlo Loretánské náměstí 109/3, Praha 1.';
}

add_action( 'wp_enqueue_scripts', function () {
	if ( ! rz_spolek_is_page() ) {
		return;
	}
	$file = plugin_dir_path( __FILE__ ) . 'o-spolku.css';
	wp_enqueue_style(
		'reformy-o-spolku',
		plugins_url( 'o-spolku.css', __FILE__ ),
		array(),
		RZ_SPOLEK_VERSION . '-' . ( file_exists( $file ) ? filemtime( $file ) : '0' )
	);
}, 100 );

add_filter( 'body_class', function ( $classes ) {
	if ( rz_spolek_is_page() ) {
		$classes[] = 'rz-o-spolku';
	}
	return $classes;
} );

/* Obsah stránky je hotové HTML; automatické odstavce by do něj vkládaly <p> a <br>. */
add_action( 'wp', function () {
	if ( rz_spolek_is_page() ) {
		remove_filter( 'the_content', 'wpautop' );
	}
} );

/*
 * Titulek: „O spolku – Reformy.cz z.s.“ (šablona jinak tvoří „O spolku | Reformy.cz“).
 * Newspaper 10 vypisuje <title> přes wp_title(); novější šablony přes title-tag. Pokrýváme obojí.
 */
function rz_spolek_title( $title ) {
	return rz_spolek_is_page() ? 'O spolku – Reformy.cz z.s.' : $title;
}
add_filter( 'pre_get_document_title', 'rz_spolek_title', 20 );
add_filter( 'wp_title', 'rz_spolek_title', PHP_INT_MAX );

add_action( 'wp_head', function () {
	if ( ! rz_spolek_is_page() ) {
		return;
	}

	// Pokud by později přibyl SEO plugin s vlastním popisem, tento řádek vypněte filtrem.
	if ( apply_filters( 'rz_spolek_print_description', true ) ) {
		echo '<meta name="description" content="' . esc_attr( rz_spolek_description() ) . '">' . "\n";
	}

	$org_id = 'https://reformy.cz/#organization';
	$data   = array(
		'@context' => 'https://schema.org',
		'@graph'   => array(
			array(
				'@type'        => 'NGO',
				'@id'          => $org_id,
				'name'         => 'Reformy.cz z.s.',
				'legalName'    => 'Reformy.cz z.s.',
				'alternateName'=> 'Reformy.cz',
				'url'          => 'https://reformy.cz/',
				'email'        => 'reformy@reformy.cz',
				'foundingDate' => '2010-03-31',
				'identifier'   => array(
					'@type'      => 'PropertyValue',
					'propertyID' => 'IČO',
					'value'      => '22874046',
				),
				'address'      => array(
					'@type'           => 'PostalAddress',
					'streetAddress'   => 'Loretánské náměstí 109/3',
					'addressLocality' => 'Praha 1 – Hradčany',
					'postalCode'      => '118 00',
					'addressCountry'  => 'CZ',
				),
				'description'  => 'Účelem spolku je vzdělávání v oblasti ekonomie a šíření myšlenek svobody a tržního hospodářství.',
				'sameAs'       => array(
					'https://or.justice.cz/ias/ui/rejstrik-$firma?ico=22874046',
				),
			),
			array(
				'@type'       => 'AboutPage',
				'@id'         => 'https://reformy.cz/o-spolku/#webpage',
				'url'         => 'https://reformy.cz/o-spolku/',
				'name'        => 'O spolku – Reformy.cz z.s.',
				'description' => rz_spolek_description(),
				'inLanguage'  => array( 'cs', 'en' ),
				'about'       => array( '@id' => $org_id ),
				'publisher'   => array( '@id' => $org_id ),
			),
		),
	);

	echo '<script type="application/ld+json">' . wp_json_encode( $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
}, 5 );
