<?php

/**
 * Includes fiels.
 *
 * All necessary files are included here.
 *
 * @since 1.0.0
 * @package Anam\Newsly
 */

namespace Anam\Newsly;

/**
 * Inilize all necessary files.
 */
class Init
{
	/**
	 * Class constructor
	 */
	public function __construct()
	{
		/**
		 * Gutenberg block
		 */
		Blocks\Block::init();
	}
}
