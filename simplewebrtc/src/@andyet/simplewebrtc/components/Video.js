"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_redux_1 = require("react-redux");
const Actions = tslib_1.__importStar(require("../actions"));
/**
 * @description
 * Local and remote video tracks can be played with the `<Video/>` component.
 *
 * The provided `media` property can include `remoteDisabled` and `localDisabled` fields. If either of those properties are `true`, video playback will be paused.
 *
 * The `qualityProfile` property can be used to request increasing or decreasing the video size/quality from the sending peer, if the media is from a remote source.
 *
 * Only one `Video` component with a `qualityProfile` should be rendered at a time for a given video track.
 *
 * @public
 *
 * @example
 * <Video media={getMediaTrack(store, 'some-media-id')} />
 */
class Video extends React.Component {
	 constructor(props) {
		super(props);

		this.state = {
		  isVideoLoading: false
		};

		this.video = React.createRef();
		this.canvas = React.createRef();

		//this.tick = this.tick.bind(this);
  }
    componentDidMount() {
        this.setup();
    }
    componentDidUpdate(prev) {
        this.setup(prev);
    }
    componentWillUnmount() {
        if (this.props.qualityProfile) {
            this.props.requestQualityProfile('high');
        }
    }
    setup(prev) {
        if (!this.props.media || !this.video) {
            return;
        }
        this.video.oncontextmenu = e => {
            e.preventDefault();
        };
        this.video.muted = true;
        this.video.autoplay = true;
		this.video.setAttribute("playsinline", true);
        let newSource = false;
        if (this.video.srcObject !== this.props.media.stream) {
            this.video.srcObject = this.props.media.stream;
            newSource = true;
        }
        if (this.props.media.source !== 'remote' ||
            !this.props.qualityProfile ||
            (prev && this.props.qualityProfile === prev.qualityProfile)) {
            return;
        }
        if (newSource || this.props.qualityProfile !== this.props.media.profile) {
            this.props.requestQualityProfile(this.props.qualityProfile);
        }
    }
    render() {
        if (!this.props.media || !this.props.media.loaded) {
            return null;
        }
		
        return (
				
		
				React.createElement("video", { ref: (el) => {
						this.video = el;
					}, style: this.props.media && this.props.media.renderMirrored
						? {
							transform: 'scaleX(-1)',
							display:'none'
							
						}
						: {}, playsInline: true })
						
			
				);
					
				
				  /*
				 return (
				// const { isVideoLoading } = this.state;
				
				  <div>
				  <p>Please wait while we load the video stream.</p>
				
					<video
					  ref={this.videoTag}
					  width="100"
					  height="100"
					  autoPlay
					  style={{ display: "none" }}
					/>

					//{!isVideoLoading && <canvas ref={this.canvas}  width="400" height="400" />}

					//{isVideoLoading && <p>Please wait while we load the video stream.</p>}
				  </div>
				);
				*/
				
				
				
				
    }
}
function mapDispatchToProps(dispatch, props) {
    return {
        requestQualityProfile: (profile) => dispatch(Actions.requestQualityProfile(props.media.id, profile))
    };
}
exports.default = react_redux_1.connect((_, props) => props, mapDispatchToProps)(Video);
