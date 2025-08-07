<?php

use PHPUnit\Framework\TestCase;
use Anam\GutenbergStarter\Blocks\Inc\Class_Movie_List_Callback;

class Test_Class_Movie_List_Callback extends TestCase {

	public function test_handle_genre_filter() {
		// Create an instance of the class
		$movie_list_callback = new Class_Movie_List_Callback();

		// Set up the genres
		$movie_list_callback->new_genres = array(
			1 => array(
				'id'   => 1,
				'name' => 'Action',
			),
			2 => array(
				'id'   => 2,
				'name' => 'Comedy',
			),
			3 => array(
				'id'   => 3,
				'name' => 'Drama',
			),
		);

		// Define the input array.
		$input = array( 1, 3 );

		// Call the function.
		$result = $movie_list_callback->handle_genre_filter( $input );

		// Define the expected result.
		$expected = array(
			1 => array(
				'id'   => 1,
				'name' => 'Action',
			),
			3 => array(
				'id'   => 3,
				'name' => 'Drama',
			),
		);

		// Assert that the result matches the expected output
		$this->assertEquals( $expected, $result );
	}
}
